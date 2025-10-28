type ExternalLinkProps = {
  href: string;
  replace?: boolean;
  className?: string;
}

export function ExternalLink({ href, replace = false, className, children }: React.PropsWithChildren<ExternalLinkProps>) {
  return (
    <a href={href} target={replace ? '_blank' : undefined} rel='noreferrer' className={className}>
      {children}
    </a>
  )
}