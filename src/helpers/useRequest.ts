
import { Accessor, createSignal } from "solid-js";


export function useRequest<Res, Req = unknown>(call: (params: Req) => Res) : [(params: Req) => Promise<Res>, Accessor<boolean>] {
    const [loading, setLoading] = createSignal(false);

    const func = async (params: Req): Promise<Res> => {
        setLoading(true);
        const result = await call(params);
        setLoading(false);
        return result;
    }

    return [func, loading];
}

export function usePagination<Res, Req extends { page?: number }>(call: (params: Req) => Res, isOver: (res: Awaited<Res>) => boolean) : [(params: Req) => Promise<Res>, Accessor<boolean>, Accessor<boolean>] {
    const [loading, setLoading] = createSignal(false);
    const [page, setPage] = createSignal(-1);
    const [isNavOver, setIsOver] = createSignal(false);

    const func = async (params: Req) => {
        setLoading(true);
        const next = page() + 1;
        setPage(next);
        const result = await call({page: next, ...params});
        setLoading(false);
        if (isOver(result)) setIsOver(true);
        return result;
    }

    return [func, loading, isNavOver];
}