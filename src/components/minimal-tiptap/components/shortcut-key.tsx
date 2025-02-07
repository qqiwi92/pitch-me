import { cn } from '@/lib/utils'
import { getShortcutKeys } from '../utils'

interface ShortcutKeyProps extends React.HTMLAttributes<HTMLSpanElement> {
  keys: string[]
  withBg?: boolean
}

const ShortcutKey = ({ className, keys, withBg, ...props }: ShortcutKeyProps) => {
  return (
    <span className={cn('text-xs hover:duration-0 tracking-widest opacity-60', className)} {...props}>
      <span
        className={cn('ml-4 ', {
          'self-end rounded bg-background text-foreground border p-1 leading-3': withBg
        })}
      >
        {getShortcutKeys(keys)}
      </span>
    </span>
  )
}

ShortcutKey.displayName = 'ShortcutKey'

export { ShortcutKey }
