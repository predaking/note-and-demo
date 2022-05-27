import React from "react";
import FilterLink from "../containers/FilterLink";
import { VisibilityFilters } from "@/common/constant";

const { SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED } = VisibilityFilters;

const Footer = () => (
    <p>
        Show:
        {' '}
        <FilterLink filter={SHOW_ALL}>All</FilterLink>
        {', '}
        <FilterLink filter={SHOW_ACTIVE}>Active</FilterLink>
        {', '}
        <FilterLink filter={SHOW_COMPLETED}>Completed</FilterLink>
    </p>
);

export default Footer;