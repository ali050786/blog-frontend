import * as React from "react"
import { X } from "lucide-react"
import { Command as CommandPrimitive } from "cmdk"
import { Badge } from "../../components/ui/badge"
import { Command, CommandGroup, CommandItem } from "../../components/ui/command"

function MultipleSelector({
  value = [],
  onChange,
  placeholder,
  options,
  ...props
}) {
  const inputRef = React.useRef(null)
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState(value)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = React.useCallback((option) => {
    setSelected(prev => prev.filter(s => s.value !== option.value))
  }, [])

  const handleKeyDown = React.useCallback((e) => {
    const input = inputRef.current
    if (input) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (input.value === "") {
          setSelected(prev => {
            const newSelected = [...prev]
            newSelected.pop()
            return newSelected
          })
        }
      }
      if (e.key === "Escape") {
        input.blur()
      }
    }
  }, [])

  const selectables = options.filter(option => !selected.some(s => s.value === option.value))

  React.useEffect(() => {
    onChange?.(selected)
  }, [selected, onChange])

  return (
    <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
      <div
        className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      >
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => {
            return (
              <Badge key={option.value} variant="secondary">
                {option.label}
                <button
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(option)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ?
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((option) => {
                return (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={() => {
                      setInputValue("")
                      setSelected(prev => [...prev, option])
                    }}
                    className={"cursor-pointer"}
                  >
                    {option.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </div>
          : null}
      </div>
    </Command>
  )
}

export default MultipleSelector