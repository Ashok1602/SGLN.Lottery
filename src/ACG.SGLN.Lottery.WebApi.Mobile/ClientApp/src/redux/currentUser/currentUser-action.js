export const Set_currentUserDetails_Success = (ActionType, Payload) => {
  return {
    type: ActionType,
    payload: Payload,
  };
};

export const Set_currentUserDetails_Failed = (ActionType, Payload) => {
  return {
    type: ActionType,
    payload: Payload,
  };
};

export const Reset_CurrentUser_state = ActionType => {
  return {
    type: ActionType,
  };
};
