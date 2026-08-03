"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function ResponsiveDialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="responsive-dialog" {...props} />
}

function ResponsiveDialogTrigger({
  ...props
}: DialogPrimitive.Trigger.Props) {
  return (
    <DialogPrimitive.Trigger
      data-slot="responsive-dialog-trigger"
      {...props}
    />
  )
}

function ResponsiveDialogPortal({
  ...props
}: DialogPrimitive.Portal.Props) {
  return (
    <DialogPrimitive.Portal
      data-slot="responsive-dialog-portal"
      {...props}
    />
  )
}

function ResponsiveDialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return (
    <DialogPrimitive.Close
      data-slot="responsive-dialog-close"
      {...props}
    />
  )
}

function ResponsiveDialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="responsive-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity duration-200 supports-backdrop-filter:backdrop-blur-xs max-sm:bg-black/60 max-sm:supports-backdrop-filter:backdrop-blur-sm data-ending-style:opacity-0 data-starting-style:opacity-0",
        className
      )}
      {...props}
    />
  )
}

function ResponsiveDialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <ResponsiveDialogPortal>
      <ResponsiveDialogOverlay />
      <DialogPrimitive.Popup
        data-slot="responsive-dialog-content"
        className={cn(
          "fixed z-50 flex flex-col bg-background text-sm text-foreground outline-none",
          "transition duration-300 ease-in-out",
          "max-sm:inset-0 max-sm:data-starting-style:translate-y-full max-sm:data-ending-style:translate-y-full",
          "sm:top-1/2 sm:left-1/2 sm:w-full sm:max-w-[90%] sm:max-h-[85dvh] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:bg-popover sm:text-popover-foreground sm:shadow-xl sm:ring-1 sm:ring-foreground/10 sm:duration-200 sm:data-starting-style:opacity-0 sm:data-starting-style:scale-95 sm:data-ending-style:opacity-0 sm:data-ending-style:scale-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="responsive-dialog-close"
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="absolute top-3 right-3 z-10"
              />
            }
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </ResponsiveDialogPortal>
  )
}

function ResponsiveDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="responsive-dialog-header"
      className={cn(
        "flex flex-col gap-1 border-b px-5 py-4 pr-12 sm:px-6 sm:pr-14",
        className
      )}
      {...props}
    />
  )
}

function ResponsiveDialogBody({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="responsive-dialog-body"
      className={cn(
        "flex-1 overflow-y-auto overscroll-contain px-5 py-4 sm:px-6",
        className
      )}
      {...props}
    />
  )
}

function ResponsiveDialogFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="responsive-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 border-t bg-muted/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6",
        className
      )}
      {...props}
    />
  )
}

function ResponsiveDialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="responsive-dialog-title"
      className={cn(
        "font-heading text-base font-medium text-foreground sm:text-lg",
        className
      )}
      {...props}
    />
  )
}

function ResponsiveDialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="responsive-dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  ResponsiveDialog,
  ResponsiveDialogBody,
  ResponsiveDialogClose,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogOverlay,
  ResponsiveDialogPortal,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
}
