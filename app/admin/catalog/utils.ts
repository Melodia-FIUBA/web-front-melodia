import { CatalogDetails, CatalogFilters, getCatalogResults, validateDateRange } from "@/lib/catalog/searchCatalog";

/**
 * UI-oriented helper that performs the search and optionally updates UI state via callbacks.
 *
 * This mirrors the previous `handleApplyFilters` logic that lived in the Catalog page.
 * The function is intentionally flexible: callers can provide callbacks for loading, error,
 * and result state, or they can simply `await` the returned CatalogResponse.
 */
export async function handleSearchFilters(
    filters: Partial<CatalogFilters>,
    callbacks?: {
        setItems?: (items: CatalogDetails[]) => void;
        setTotal?: (n: number) => void;
        setLoading?: (b: boolean) => void;
        setError?: (s: string | null) => void;
    }
): Promise<CatalogDetails[] | null> {
    const { setItems, setTotal, setLoading, setError} = callbacks ?? {};

    // Clear previous error
    setError?.(null);

    // Validate date range before calling
    if (!validateDateRange(filters.publishedFrom ?? '', filters.publishedTo ?? '')) {
        setError?.('Rango de fechas inválido');
        return null;
    }

    setLoading?.(true);
    try {
        const [items, total] = await getCatalogResults(filters);

        setItems?.(items ?? []);
        setTotal?.(total ?? 0);
        return items;
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        setError?.(message);
        setItems?.([]);
        setTotal?.(0);
        return null;
    } finally {
        setLoading?.(false);
    }
}