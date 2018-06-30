import {defineAction} from "../flux/Action";

export const login = defineAction<(username: string, password: string) => void>();

export const logout = defineAction<() => void>();
