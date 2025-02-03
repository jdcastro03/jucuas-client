export interface VerifyUniqueUserDataParameterModel {
  type: VerifyUniqueUserDataType;
  data: string;
  user: string;
}

export type VerifyUniqueUserDataType = 'phone' | 'email' | 'curp' | 'username';
