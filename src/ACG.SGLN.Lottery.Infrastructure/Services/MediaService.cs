using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ImageProcessor;
using ImageProcessor.Plugins.WebP.Imaging.Formats;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace ACG.SGLN.Lottery.Infrastructure.Services
{
    public class MediaService : IMediaService
    {
        public byte[] AddWatermarkToImage(byte[] imageData)
        {
            string str = "Auto Hall";
            using (var stream = new MemoryStream(imageData))
            {
                var watermarkedStream = new MemoryStream();
                using (var img = Image.FromStream(stream))
                {
                    using (var graphic = Graphics.FromImage(img))
                    {
                        graphic.TranslateTransform(img.Width / 2, img.Height / 2);
                        //graphic.RotateTransform(57.296f * (float)Math.Atan2(img.Height, img.Width));

                        Image watermarkImage = LoadWatermarkImage();
                        float watermarkRatio = watermarkImage.Width / watermarkImage.Height;
                        float watermarkWidth = img.Width / 3.0f;
                        float watermarkHeight = watermarkWidth / watermarkRatio;
                        if (watermarkWidth > watermarkImage.Width)
                        {
                            watermarkWidth = watermarkImage.Width;
                            watermarkHeight = watermarkImage.Height;

                        }

                        graphic.DrawImage(watermarkImage, -(watermarkImage.Width / 2), -(watermarkImage.Height / 2), watermarkWidth, watermarkHeight);

                        img.Save(watermarkedStream, ImageFormat.Png);

                        return watermarkedStream.ToArray();
                    }
                }
            }
        }

        private Image LoadWatermarkImage()
        {
            byte[] bytes = Convert.FromBase64String("iVBORw0KGgoAAAANSUhEUgAAAGQAAAApCAMAAAD0+nzUAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAmRQTFRFAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Pmgb1QAAAMx0Uk5TAAEcPltudn2BhIN3b2BEIwUCHkK81M/Hvrm2v9HLjFQiCwooZZe908aukWZMMh8aFyAzSo2cmnE2EjSlxLVfKQ8RJWSyB0/FA68kCWfA0k4GP5I1zMMqGVWPXQxBU3B5glqJhg0slqGssJtWPDcwJwgEn00tGKhHGxOAjp2jp81ycx0QrZMVXitjOUh+tCEWaGqes2yIotAxhyaxqsJGXMlXyHyLdc7KYi5LoHqKuKbBL0lZkENRhbdSbQ67OGs7RWFQPXh/aZV0lJk6Ci1+7AAABdFJREFUeJztV/lfUlkUvwiZqSTonBRDJR9FKaK4BC6pgM8BJdTMJdHEBbNwJNTyWaajpqZR2jIV2kyLpVmz1aRNOdNU2qz/1Nz3QNEJ0cofZj6f+X4++u5795zzvWe5514Q8gaWD5uzyXez35Yt/n6bAwK5W4N4XuXfG/zgEP9PwIltoWGC8HDB9lBhRGSUaMcGMUQT4p27JLT93XtiYqVxhCw+ISFeTiQmBSan7FUoUzeAIy09w+nCvsysbNbKOZZKrcnZI47+OAYyN53xAT7dzOZ7FtHGBegC8j6cIl+/n2EwhBcUepPjFcUcKP4wikJ25EGGo0RRuooXi2CVlR+qkLG8C3mEsbKqIvZwtak6bg0KBtk1tVUbUQJrQB1TV/8e4nxzwWH/hiONR9OPJftXB8ZWWKqkWyubPmsuteaVHV9VzZbW0tpU3JZ3wri26/xEHRjCTla3B5HvTrKM8qw8kYzqIG0eUpB66nRD55muRl1LcoCYbQ7OXpXNR9B9OleW730lWo8kDGzH6zt8gsxKaY3+8x5ua1qvp/bTd1Zv886wfuzobZMq+mMH3p2ReQjTx4CntgwWUB9S4O8J/jmlesPiszpI1Ue2uH8n+HKCkDtTryIIK13K/BMEERQtIpagZuZV0qHYKMqtmTpsqTkftJhgI5ZTMSNymaarzkS483azmWEFgDAOP6PtAILiC7CE/RexkcwIeii0Jzj1RkaZd0gXaelX3iU8vsxsRuKKW/OqU9iXPkC+0K5FoooUQkaOLgwk15jDRK277prcxaFNm8PpM+KGZ5KRbnocJl+LxGGAlrEOldwEMI5Dyr9Jfw89Sh8OvjRJICNo+gfJl18xJGIACfb71rsk9JcDAFcIejAMklqmVfKHuoGL0Ci2kNOqRdnc23foUlXp8GkKcNe4lLGsMHwJsTBDGx76TQA0BnsnuQcl9x0p18501gbugxw0gt0MbWYs9DH/pQaYVOILzqDWxXFiD46ewtkwiyUwpWwCiHjgnaQRDEL8UWegn9vIMbzqs8tOk+ORAC2F/QBngl21hlMIDmcpDsTgyXwbTpqA9EqCEy4EQ7tZAAZcKPHTOBeXl3WnXHzDeYjasYiGeefV4XA+csWOPQXwNUV9gxUTEarBJIn0MvwAvo1bQXIBxkdLwHR1ajLgGEiMpXcBvlvWVxuw5jmq+HuAI8xGKzIATD12ztn63RUUg9AT/PgBf6YeAejkK0hqoTG7F8cIlLanMI4G6Jwwy0Ad+E8uWTIzWYTfLbcBtre5FqAucZMIKSSiqzUeaTk4nju1K0hmQBLIw4G/wEqKgEsIVdPbsJmP8tmhRYVI4TYDN7XIjD2anHVxsPQSEDqeYcTg3eLgMcX/46G9oQDXn6MVJORTodDfTwidL0JhfASX7Flc+hkpyekHIUM89xPAUdrMM1xSkmFZCu1RVwuNQeSDjXYxxuawToka/bzk9jHjShKkuoaZJYC3uWCMCcLUoqjhpQbotDsdBrj3ZFl87Eg86dqFzg0rRkjZxdBMBrjuKG4SNDLBXP2E/WPOd6vJeRXU/ULhBAmc1UruBjhYs4IkHrdJV4nQPZQucb7slWU2bW6xaiiCEC0VUX175uvcEXdJ9aXNlodgpXyrU5dGL7YTr3Z34QT0P/4LUJWz3rRuOTXPRVHT7GmTnT2typ2NRq+fVVMTCj7vvr1KzVHWLaisfqYOi+M50gyjTFPaW/KFYyZBjyzr++nK/5WyP3wrpXYWvW2q6rSqk5oS9JfqUc/rEOWClE/eD355PsSXmq/rIWRRo2WyhN9e2hxV1vSQ2bKe8zff/L7OWyLbXvFkk3nuQNxEU9XJVHL+FaXBJJtm1OTjBhmpKBw0Zy/wrH8spNrucFk2rq7xIhU7mi4tYgXmDtn/XCdJn2KgjSMda0Uz6ht/1WhkGs505ZvK2edJpeV6o81i4bBQUdQDqplzSx5lyS0gx4o5lnlx/pClvWNYZfFwZ/wb/2CaGwyOUMwAAAAASUVORK5CYII=");

            Image image;
            using (MemoryStream ms = new MemoryStream(bytes))
            {
                image = Image.FromStream(ms);
            }

            return image;
        }

        public Stream GetWebP(Stream stream)
        {
            MemoryStream webPStream = new MemoryStream();

            using (ImageFactory imageFactory = new ImageFactory(preserveExifData: false))
            {
                imageFactory.Load(((MemoryStream)stream).ToArray()).Format(new WebPFormat()).Quality(100).Save(webPStream);
            }

            return webPStream;
        }

        public Stream GetThumbnail(Stream stream)
        {
            Size size = ResizeKeepAspect(new Size(640, 360), 640, 360);
            Image image = Image.FromStream(stream);
            Image thumb = image.GetThumbnailImage(size.Width, size.Height, () => false, IntPtr.Zero);

            MemoryStream ms = new MemoryStream();
            thumb.Save(ms, ImageFormat.Png);

            return ms;
        }

        private Size ResizeKeepAspect(Size src, int maxWidth, int maxHeight, bool enlarge = false)
        {
            maxWidth = enlarge ? maxWidth : Math.Min(maxWidth, src.Width);
            maxHeight = enlarge ? maxHeight : Math.Min(maxHeight, src.Height);

            decimal rnd = Math.Min(maxWidth / (decimal)src.Width, maxHeight / (decimal)src.Height);
            return new Size((int)Math.Round(src.Width * rnd), (int)Math.Round(src.Height * rnd));
        }
    }
}