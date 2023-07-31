export const Set_ModuleDetails_Success = (ActionType, Payload) => {
  return {
    type: ActionType,
    payload: Payload,
  };
};

export const Set_ModuleDetails_Failed = (ActionType, Payload) => {
  return {
    type: ActionType,
    payload: Payload,
  };
};

export const Reset_ModuleDetails_state = ActionType => {
  return {
    type: ActionType,
  };
};
