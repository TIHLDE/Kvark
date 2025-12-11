type ExternalLinkProps = {
  href: string;
  openNewTab?: boolean;
  className?: string;
}

export function ExternalLink({ href, openNewTab = false, className, children }: React.PropsWithChildren<ExternalLinkProps>) {
  return (
    <a href={href} target={openNewTab ? '_blank' : undefined} rel='noreferrer' className={className}>
      {children}
    </a>
  )
}