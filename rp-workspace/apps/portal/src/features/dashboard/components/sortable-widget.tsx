import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Widget } from '../types';

interface SortableWidgetProps {
    widget: Widget;
    children: React.ReactElement<{ className?: string; dragHandleProps?: any }>;
    disabled?: boolean;
}

export function SortableWidget({ widget, children, disabled }: SortableWidgetProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: widget.widgetId, disabled });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className={children.props.className}>
            {React.cloneElement(children, {
                dragHandleProps: { ...attributes, ...listeners },
                className: 'h-full'
            })}
        </div>
    );
}
