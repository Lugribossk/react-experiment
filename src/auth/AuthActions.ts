import {defineAction} from "../flux/Action";

/**
 * @param username Username
 * @param password Password
 */
export const login = defineAction<[string, string]>();

export const logout = defineAction<[]>();
