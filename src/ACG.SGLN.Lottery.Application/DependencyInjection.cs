using ACG.SGLN.Lottery.Application.Commands;
using ACG.SGLN.Lottery.Application.Common.Authorizations;
using ACG.SGLN.Lottery.Application.Common.Behaviours;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Application.Queries;
using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.Domain.Entities;
using FluentValidation;
using MediatR;
using MediatR.Behaviors.Authorization.Extensions.DependencyInjection;
using MediatR.Behaviors.Authorization.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace ACG.SGLN.Lottery.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddMediatR(Assembly.GetExecutingAssembly());

            services.AddMediatorAuthorization();
            //services.AddAuthorizersFromAssembly(Assembly.GetExecutingAssembly());

            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehaviour<,>));

            var method = typeof(DependencyInjection).GetTypeInfo().DeclaredMethods
                .Single(m => m.Name == nameof(RegisterGenericRequestHandlers));
            var entities = Assembly.GetAssembly(typeof(BaseEntity<>)).GetTypes()
                .Where(t => t.IsClass && !t.IsAbstract && t.Namespace == typeof(User).Namespace)
                .ToList();
            foreach (var entityType in entities)
                if (entityType.IsBaseEntity(out var t))
                    method.MakeGenericMethod(entityType, t).Invoke(null, new[] { services });

            method = typeof(DependencyInjection).GetTypeInfo().DeclaredMethods
                .Single(m => m.Name == nameof(RegisterAllicationRequestHandlers));
            var requestHandlerTypes = GetAllTypesImplementingOpenGenericType(typeof(IApplicationRequestHandler<,>), Assembly.GetExecutingAssembly());
            foreach (var handlerType in requestHandlerTypes)
            {
                var type = handlerType.GetInterfaces()
                    .Where(y => y.GetGenericTypeDefinition().Equals(typeof(IApplicationRequestHandler<,>))).FirstOrDefault();
                if (type != null)
                    method.MakeGenericMethod(handlerType, type.GetGenericArguments()[0],
                        type.GetGenericArguments()[1]).Invoke(null, new[] { services });
            }

            //services.AddTransient(typeof(IRequestHandler<CreateDtoCommand<StorageArea, StorageAreaDto, Guid>, StorageArea>),
            //    typeof(CreateDtoCommandHandler<StorageArea, StorageAreaDto, Guid>));

            //services.AddTransient(typeof(IRequestHandler<UpdateDtoCommand<StorageArea, StorageAreaDto, Guid>, Unit>),
            //    typeof(UpdateDtoCommandHandler<StorageArea, StorageAreaDto, Guid>));
            return services;
        }

        public static void RegisterGenericRequestHandlers<TEntity, T>(IServiceCollection services)
            where TEntity : BaseEntity<T>
        {
            services.AddTransient(typeof(IRequestHandler<CreateCommand<TEntity, T>, TEntity>),
                typeof(CreateCommandHandler<TEntity, T>));
            services.AddTransient(typeof(IRequestHandler<DeleteCommand<TEntity, T>, Unit>),
                typeof(DeleteCommandHandler<TEntity, T>));

            services.AddTransient(typeof(IRequestHandler<GetByIdQuery<TEntity, T>, TEntity>),
                typeof(GetByIdQueryHandler<TEntity, T>));
            services.AddTransient(typeof(IRequestHandler<GetAllQuery<TEntity, T>, PagedResult<TEntity>>),
                typeof(GetAllQueryHandler<TEntity, T>));


        }

        public static void RegisterAllicationRequestHandlers<THandler, TRequest, TResponse>(IServiceCollection services)
            where THandler : IApplicationRequestHandler<TRequest, TResponse>
            where TRequest : IRequest<TResponse>
        {
            services.AddTransient(typeof(IRequestHandler<TRequest, TResponse>),
                        typeof(THandler));

            services.AddTransient(typeof(IAuthorizer<TRequest>), typeof(QueryCommandBasedAuthorizer<TRequest>));

        }

        //TODO: move to ReflectionUtil.cs
        private static bool IsGenericRequestHandler(Type t)
        {
            return t.IsGenericTypeDefinition && t.GetInterfaces().Any(i =>
                i.IsGenericType && (i.GetGenericTypeDefinition() == typeof(IRequest<>) ||
                                    i.GetGenericTypeDefinition() == typeof(IRequestHandler<,>)));
        }

        //TODO: move to ReflectionUtil.cs
        private static bool IsBaseEntity(this Type type, out Type t)
        {
            for (var baseType = type.BaseType; baseType != null; baseType = baseType.BaseType)
                if (baseType.IsGenericType && baseType.GetGenericTypeDefinition() == typeof(BaseEntity<>))
                {
                    t = baseType.GetGenericArguments()[0];
                    return true;
                }

            t = null;
            return false;
        }

        public static List<Type> GetAllTypesImplementingOpenGenericType(Type openGenericType, Assembly assembly)
        {
            return assembly.GetTypes()
                .Where(x => x.GetInterfaces().Any(y => y.IsGenericType && y.GetGenericTypeDefinition().Equals(openGenericType))).ToList();
        }
    }
}