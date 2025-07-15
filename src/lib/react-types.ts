// React 19 compatibility helpers
import * as React from "react";

// Helper type to fix React 19 forwardRef component usage
export type ComponentType<P = {}> = React.ComponentType<P>;

// Type assertion helper for forwardRef components
export function asComponent<T>(component: T): ComponentType<any> {
  return component as any;
}

// Specific type helpers for common shadcn/ui components
export type ButtonComponent = ComponentType<any>;
export type AvatarComponent = ComponentType<any>;
export type TableComponent = ComponentType<any>;
export type FormComponent = ComponentType<any>;
export type BadgeComponent = ComponentType<any>;
