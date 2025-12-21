"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface MultiSelectProps {
    options: { label: string; value: string }[]
    onValueChange: (value: string[]) => void
    defaultValue?: string[]
    placeholder?: string
    variant?: "default" | "inverted"
    disabled?: boolean
    className?: string
}

export function MultiSelect({
    options,
    onValueChange,
    defaultValue = [],
    placeholder = "Select options",
    variant = "default",
    disabled = false,
    className,
}: MultiSelectProps) {
    const [selected, setSelected] = React.useState<string[]>(defaultValue)

    React.useEffect(() => {
        setSelected(defaultValue)
    }, [defaultValue])

    const handleSelect = (value: string) => {
        const newSelected = selected.includes(value)
            ? selected.filter((item) => item !== value)
            : [...selected, value]

        setSelected(newSelected)
        onValueChange(newSelected)
    }

    const handleSelectAll = () => {
        if (selected.length === options.length) {
            setSelected([])
            onValueChange([])
        } else {
            const allValues = options.map(o => o.value)
            setSelected(allValues)
            onValueChange(allValues)
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className={cn(
                        "w-full justify-between text-left font-normal",
                        !selected.length && "text-muted-foreground",
                        className
                    )}
                >
                    <span className="truncate">
                        {selected.length === 0
                            ? placeholder
                            : selected.length === options.length
                                ? "All selected"
                                : selected.length > 2
                                    ? `${selected.length} selected`
                                    : options
                                        .filter((option) => selected.includes(option.value))
                                        .map((option) => option.label)
                                        .join(", ")}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]" align="start">
                {options.length > 0 && (
                    <>
                        <DropdownMenuCheckboxItem
                            checked={selected.length === options.length}
                            onCheckedChange={handleSelectAll}
                        >
                            Select All
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuSeparator />
                    </>
                )}

                {options.map((option) => (
                    <DropdownMenuCheckboxItem
                        key={option.value}
                        checked={selected.includes(option.value)}
                        onCheckedChange={() => handleSelect(option.value)}
                    >
                        {option.label}
                    </DropdownMenuCheckboxItem>
                ))}
                {options.length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground text-center">No options available</div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
