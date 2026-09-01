"use client";

import {
    useEffect,
    useState,
} from "react";

import { useDispatch } from "react-redux";

import useDebounce from "../model/useDebounce";

import {
    setSearch,
} from "../model/productSearchSlice";

import "../style/ProductSearch.css";

export default function ProductSearch() {
    const [line, setLine] =
        useState("");

    const debouncedLine =
        useDebounce(line, 300);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            setSearch(
                debouncedLine.trim(),
            ),
        );
    }, [
        debouncedLine,
        dispatch,
    ]);

    return (
        <div className="container-search">
            <input
                value={line}
                onChange={(event) =>
                    setLine(
                        event.target.value,
                    )
                }
                className="search-input"
                placeholder="Поиск товаров"
                type="text"
            />
        </div>
    );
}