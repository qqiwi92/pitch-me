import type { Editor } from '@tiptap/core'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { LinkProps } from '../../types'
import { cn } from '@/lib/utils'

interface LinkEditBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  editor: Editor
  onSetLink: ({ url, text, openInNewTab }: LinkProps) => void
  close?: () => void
}

const LinkEditBlock = ({ editor, onSetLink, close, className, ...props }: LinkEditBlockProps) => {
  const [field, setField] = useState<LinkProps>({
    url: '',
    text: '',
    openInNewTab: false
  })

  const data = useMemo(() => {
    const { href, target } = editor.getAttributes('link')
    const { from, to } = editor.state.selection
    const text = editor.state.doc.textBetween(from, to, ' ')

    return {
      url: href,
      text,
      openInNewTab: target === '_blank' ? true : false
    }
  }, [editor])

  useEffect(() => {
    setField(data)
  }, [data])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSetLink(field)
    close?.()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={cn('space-y-4', className)} {...props}>
        <div className="space-y-1">
          <Label>Link</Label>
          <Input
            type="url"
            required
            placeholder="Paste a link"
            value={field.url ?? ''}
            onChange={e => setField({ ...field, url: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label>Display text (optional)</Label>
          <Input
            type="text"
            placeholder="Text to display"
            value={field.text ?? ''}
            onChange={e => setField({ ...field, text: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Label>Open in new tab</Label>
          <Switch
            checked={field.openInNewTab}
            onCheckedChange={() => setField({ ...field, openInNewTab: !field.openInNewTab })}
          />
        </div>

        <div className="flex justify-end space-x-2">
          {close && (
            <Button variant="ghost" type="button" onClick={close}>
              Cancel
            </Button>
          )}

          <button className="inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium cursor-pointer ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" type="submit">Insert</button>
        </div>
      </div>
    </form>
  )
}

export { LinkEditBlock }
