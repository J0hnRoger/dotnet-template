export type UnaryFunction<T, R> = (arg: T) => R;

export function pipe<T1, T2, T3>(fn1: UnaryFunction<T1, T2>, fn2: UnaryFunction<T2, T3>): UnaryFunction<T1, T3>;
export function pipe<T1, T2, T3, T4>(fn1: UnaryFunction<T1, T2>, fn2: UnaryFunction<T2, T3>, fn3: UnaryFunction<T3, T4>): UnaryFunction<T1, T4>;

export function pipe(...fns: UnaryFunction<any, any>[]): UnaryFunction<any, any> {
    return (arg: any) => fns.reduce((prev, fn) => fn(prev), arg);
}

export type Success<T> = { isSuccess: true; value: T };
export type Failure<E> = { isSuccess: false; error: E };

export type Result<T, E> = Success<T> | Failure<E>;

// Fonctions utilitaires
export function Success<T>(value: T): Result<T, any> {
    return { isSuccess: true, value };
}

// Fonctions utilitaires
export function Failure<E>(error: E): Result<any, E> {
    return { isSuccess: false, error };
}

export function sortBy<T>(property: keyof T, desc = false): (array: T[]) => T[] {
    return (array: T[]): T[] => {
        return array.sort((a, b) => {
            if (a[property] < b[property]) {
                return desc ? 1 : -1;
            }
            if (a[property] > b[property]) {
                return desc ? -1 : 1;
            }
            return 0;
        });
    };
}
