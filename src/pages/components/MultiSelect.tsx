
import * as React from "react"
import { X } from "lucide-react"
import { Command as CommandPrimitive } from "cmdk"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"

export type OptionType = {
  value: string
  label: string
}

interface MultiSelectProps {
  options: OptionType[]
  selected: string[]
  onChange: (selected: string[]) => void
  placeholder?: string
  className?: string
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Selecione...",
  className,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const handleUnselect = (value: string) => {
    onChange(selected.filter((item) => item !== value))
  }

  const handleSelect = (value: string) => {
    if (selected.includes(value)) {
      handleUnselect(value)
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <Command className={`overflow-visible bg-transparent ${className}`}>
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((value) => (
            <Badge
              key={value}
              variant="secondary"
              className="rounded-sm px-1 font-normal"
            >
              {options.find((option) => option.value === value)?.label || value}
              <button
                className="ml-1 rounded-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(value)
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => handleUnselect(value)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selected.length === 0 ? placeholder : ""}
            className="ml-1 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative">
        {open && (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="max-h-[200px] overflow-y-auto">
              {options.length > 0 ? (
                options
                  .filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  )
                  .map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => handleSelect(option.value)}
                      className="cursor-pointer"
                    >
                      <div
                        className={`mr-2 h-4 w-4 rounded-sm border ${
                          selected.includes(option.value)
                            ? "bg-primary text-primary-foreground"
                            : "opacity-50"
                        }`}
                      >
                        {selected.includes(option.value) ? (
                          <div className="flex h-full items-center justify-center">
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                                fill="currentColor"
                                fillRule="evenodd"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </div>
                        ) : null}
                      </div>
                      {option.label}
                    </CommandItem>
                  ))
              ) : (
                <div className="px-2 py-1 text-center text-sm">
                  Nenhuma opção encontrada.
                </div>
              )}
            </CommandGroup>
          </div>
        )}
      </div>
    </Command>
  )
}
