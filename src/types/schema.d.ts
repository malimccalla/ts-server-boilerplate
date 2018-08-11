// tslint:disable
// graphql typescript definitions

declare namespace GQL {
  interface IGraphQLResponseRoot {
    data?: IQuery | IMutation;
    errors?: Array<IGraphQLResponseError>;
  }

  interface IGraphQLResponseError {
    /** Required for all errors */
    message: string;
    locations?: Array<IGraphQLResponseErrorLocation>;
    /** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
    [propName: string]: any;
  }

  interface IGraphQLResponseErrorLocation {
    line: number;
    column: number;
  }

  interface IQuery {
    me: IUser | null;
    hello: string;
  }

  interface IHelloOnQueryArguments {
    name?: string | null;
  }

  interface IUser {
    email: string | null;
    id: string;
  }

  interface IMutation {
    sendForgotPasswordEmail: IForgotPasswordResponse;
    forgotPasswordChange: IForgotPasswordResponse;
    login: ILoginResponse;
    logout: boolean | null;
    register: IRegisterResponse;
  }

  interface ISendForgotPasswordEmailOnMutationArguments {
    input: ISendForgotPasswordEmailInput;
  }

  interface IForgotPasswordChangeOnMutationArguments {
    input: IForgotPasswordChangeInput;
  }

  interface ILoginOnMutationArguments {
    email: string;
    password: string;
  }

  interface IRegisterOnMutationArguments {
    email: string;
    password: string;
  }

  interface ISendForgotPasswordEmailInput {
    email: string;
  }

  interface IForgotPasswordResponse {
    ok: boolean;
    errors: Array<IError>;
  }

  interface IError {
    path: string;
    message: string;
  }

  interface IForgotPasswordChangeInput {
    newPassword: string;
    key: string;
  }

  interface ILoginResponse {
    ok: boolean;
    user: IUser | null;
    errors: Array<IError>;
  }

  interface IRegisterResponse {
    ok: boolean;
    user: IUser | null;
    errors: Array<IError>;
  }
}

// tslint:enable
