import React from 'react'

export function Button({ children, variant = 'default', size = 'default', asChild, ...props }) {
  const Comp = asChild ? 'span' : 'button'
  return (
    <Comp 
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background
        ${variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' : ''}
        ${variant === 'outline' ? 'border border-input hover:bg-accent hover:text-accent-foreground' : ''}
        ${size === 'icon' ? 'h-10 w-10' : 'h-10 px-4 py-2'}`
      }
      {...props}
    >
      {children}
    </Comp>
  )
}