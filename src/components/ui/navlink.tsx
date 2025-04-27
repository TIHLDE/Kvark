import React from 'react';
import { Link, href } from 'react-router';

export type LinkPathType = Parameters<typeof href>[0];
export type LinkParamsType<TPath extends LinkPathType> = Parameters<typeof href<TPath>>[1];

export default function NavLink<TPath extends LinkPathType>(props: { to: TPath, params?: LinkParamsType<TPath> } & Omit<React.ComponentProps<typeof Link>, 'to'>) {
    const { to, params, ...rest } = props;
    return (
        // @ts-expect-error can't react-router cant convert the type, but we know it's correct
        <Link to={href(props.to, props.params)} {...rest}>
            {props.children}
        </Link>
    );
}