import * as Data from "effect/Data";

interface IAjaxClientResponse<TData = any> {
  data?: TData;
  error?: {
    status: number;
    message: string;
    description?: string;
  };
}

export class AjaxClientResponse<TData = any> extends Data.Class<
  IAjaxClientResponse<TData>
> {}

export const make = <TData = undefined>(
  data: Parameters<ReturnType<typeof Data.case<AjaxClientResponse<TData>>>>[0],
) => Data.case<AjaxClientResponse<TData>>()(data);
