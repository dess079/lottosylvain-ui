import * as React from "react"

import { cn } from "../../../lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-transparent text-card-foreground flex flex-col gap-8 rounded-xl border py-10 px-10 shadow-xl", // Changé bg-card en bg-transparent
        "transform transition-all duration-300 hover:shadow-2xl hover:translate-y-[-5px]",
        "relative before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:content-['']",
        "after:absolute after:inset-0 after:rounded-xl after:shadow-[0_15px_35px_-20px_rgba(0,0,0,0.3)] after:content-['']",
        "dark:before:from-gray-800/10 dark:before:to-transparent dark:after:shadow-[0_15px_35px_-20px_rgba(0,0,0,0.5)]",
        "my-8 backdrop-blur-sm", // Ajout de backdrop-blur-sm
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-4 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto]",
        "relative z-10",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-tight font-bold text-xl", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-base mt-2", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "px-6 relative z-10 pt-2",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
