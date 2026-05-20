import type { FilterKeys, HttpMethod, OperationRequestBodyContent, PathsWithMethod, ResponseObjectMap, SuccessResponse } from 'openapi-typescript-helpers';
import ky, { type Options as KyOptions, type BeforeErrorHook, type KyInstance } from 'ky';
import type { paths } from '@tihlde/sdk';

// -- Operation type extraction --

type OpOf<Paths extends object, Path extends keyof Paths, Method extends HttpMethod> = FilterKeys<Paths[Path], Method>;

type BodyOf<Paths extends object, Path extends keyof Paths, Method extends HttpMethod> = OperationRequestBodyContent<OpOf<Paths, Path, Method>>;

type SuccessOf<Paths extends object, Path extends keyof Paths, Method extends HttpMethod> = SuccessResponse<
  Extract<ResponseObjectMap<OpOf<Paths, Path, Method>>, Record<number | string, unknown>>
>;

type PathOf<Paths extends object, Method extends HttpMethod> = PathsWithMethod<Paths, Method> & string;

// -- Parameter extraction --

type PathParamsOf<Op> = Op extends { parameters: { path: infer P } } ? (P extends Record<string, unknown> ? P : never) : never;

type QueryParamsOf<Op> = Op extends { parameters: { query?: infer Q } } ? (NonNullable<Q> extends Record<string, unknown> ? NonNullable<Q> : never) : never;

// -- Options building --

type PathParamsOption<Op> = [PathParamsOf<Op>] extends [never] ? { params?: never } : { params: PathParamsOf<Op> };

type SearchParamsOption<Op> = [QueryParamsOf<Op>] extends [never] ? unknown : { searchParams?: QueryParamsOf<Op> };

type BodyOption<Body> = [Body] extends [never | undefined] ? unknown : { json: Body };

type Options<Body = never, Op = unknown> = Omit<KyOptions, 'json' | 'searchParams'> & BodyOption<Body> & PathParamsOption<Op> & SearchParamsOption<Op>;

// Make options required when path params exist
type InitArgs<Body, Op> = [PathParamsOf<Op>] extends [never] ? [options?: Options<Body, Op>] : [options: Options<Body, Op>];

// -- Hooks --

type BeforeHTTPErrorHook = BeforeErrorHook;
type BeforeAnyErrorHook = (error: unknown) => void;

type Hooks = Omit<NonNullable<KyOptions['hooks']>, 'beforeError'> & {
  beforeHTTPError?: BeforeHTTPErrorHook[];
  beforeAnyError?: BeforeAnyErrorHook[];
};

type ClientOptions = Omit<KyOptions, 'hooks'> & {
  hooks?: Hooks;
};

// -- Implementation --

function resolvePath(path: string, params: Record<string, unknown>): string {
  return path.replace(/{(\w+)}/g, (_, key: string) => {
    const value = params[key];
    if (value === undefined || value === null) {
      throw new Error(`Missing path parameter: ${key}`);
    }
    return encodeURIComponent(String(value));
  });
}

class Client<Paths extends object> {
  protected api: KyInstance;
  private readonly beforeAnyErrorHooks: BeforeAnyErrorHook[];

  constructor(options: ClientOptions) {
    const { hooks, ...kyOptions } = options;
    const { beforeHTTPError, beforeAnyError, ...kyHooks } = hooks ?? {};

    this.beforeAnyErrorHooks = beforeAnyError ?? [];

    this.api = ky.create({
      ...kyOptions,
      hooks: {
        ...kyHooks,
        beforeError: beforeHTTPError ?? [],
      },
    });
  }

  get<Path extends PathOf<Paths, 'get'>>(path: Path, ...args: InitArgs<never, OpOf<Paths, Path, 'get'>>): Promise<SuccessOf<Paths, Path, 'get'>> {
    return this.request('get', path, args[0]) as Promise<SuccessOf<Paths, Path, 'get'>>;
  }

  post<Path extends PathOf<Paths, 'post'>>(
    path: Path,
    ...args: InitArgs<BodyOf<Paths, Path, 'post'>, OpOf<Paths, Path, 'post'>>
  ): Promise<SuccessOf<Paths, Path, 'post'>> {
    return this.request('post', path, args[0]) as Promise<SuccessOf<Paths, Path, 'post'>>;
  }

  put<Path extends PathOf<Paths, 'put'>>(
    path: Path,
    ...args: InitArgs<BodyOf<Paths, Path, 'put'>, OpOf<Paths, Path, 'put'>>
  ): Promise<SuccessOf<Paths, Path, 'put'>> {
    return this.request('put', path, args[0]) as Promise<SuccessOf<Paths, Path, 'put'>>;
  }

  patch<Path extends PathOf<Paths, 'patch'>>(
    path: Path,
    ...args: InitArgs<BodyOf<Paths, Path, 'patch'>, OpOf<Paths, Path, 'patch'>>
  ): Promise<SuccessOf<Paths, Path, 'patch'>> {
    return this.request('patch', path, args[0]) as Promise<SuccessOf<Paths, Path, 'patch'>>;
  }

  delete<Path extends PathOf<Paths, 'delete'>>(path: Path, ...args: InitArgs<never, OpOf<Paths, Path, 'delete'>>): Promise<SuccessOf<Paths, Path, 'delete'>> {
    return this.request('delete', path, args[0]) as Promise<SuccessOf<Paths, Path, 'delete'>>;
  }

  private async request(method: string, path: string, options?: Record<string, unknown>) {
    const { params, ...kyOptions } = options ?? {};

    let resolvedPath = path;
    if (params) {
      resolvedPath = resolvePath(path, params as Record<string, unknown>);
    }

    // Strip leading slash — ky prefixUrl doesn't want it
    if (resolvedPath.startsWith('/')) {
      resolvedPath = resolvedPath.slice(1);
    }

    try {
      const response = await this.api(resolvedPath, {
        method,
        ...(kyOptions as KyOptions),
      });

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        return response.json();
      }

      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return undefined;
      }

      return response.text();
    } catch (error) {
      for (const hook of this.beforeAnyErrorHooks) {
        hook(error);
      }
      throw error;
    }
  }
}

export function createClient<Paths extends object>(options: ClientOptions): Client<Paths> {
  return new Client<Paths>(options);
}

export type { Client, ClientOptions, Options, Hooks, BeforeHTTPErrorHook, BeforeAnyErrorHook };

export const apiClient = createClient<paths>({
  prefixUrl: import.meta.env.VITE_API_URL ?? 'https://photon.tihlde.org/',
});
