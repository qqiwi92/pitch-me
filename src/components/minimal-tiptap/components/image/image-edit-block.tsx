import type { Editor } from "@tiptap/core";
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

interface ImageEditBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  editor: Editor;
  close: () => void;
}

const ImageEditBlock = ({
  editor,
  className,
  close,
  ...props
}: ImageEditBlockProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState<string>("");

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleLink = () => {
    editor.chain().focus().setImage({ src: link }).run();
    close();
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      editor.chain().setImage({ src }).focus().run();
    };

    reader.readAsDataURL(files[0]);

    close();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLink();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={cn("space-y-6", className)} {...props}>
        <div className="space-y-1">
          <Label>Attach an image link</Label>
          <div className="flex">
            <Input
              type="url"
              required
              placeholder="https://example.com"
              value={link}
              className="grow"
              onChange={(e) => setLink(e.target.value)}
            />
            <button type="submit" className="ml-2 h-9 inline-block  items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium cursor-pointer ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90  px-4 py-2">
              Submit
            </button>
          </div>
        </div>
        <Button className="w-full mt-3" onClick={handleClick}>
          <Crown className="mr-2 size-4" /> Upload from your computer
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          multiple
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </form>
  );
};

export { ImageEditBlock };
