import { useEffect, useState } from "react";
import { peminjamanService } from "../services/peminjamanService";
import { useBooks } from "./useBook";
import { useBookCategories } from "./useBookCategories";
import { useUsers } from "./useUsers";

export const useParallelDataFetch = () => {
  const [totalPeminjaman, setTotalPeminjaman] = useState(0);
  const [peminjamanData, setPeminjamanData] = useState([]);
  const [peminjamanLoading, setPeminjamanLoading] = useState(true);

  const {
    books,
    loading: booksLoading,
    totalItems: totalBooks,
  } = useBooks({ limit: 1000 });

  const { users, loading: usersLoading } = useUsers({ limit: 1000 });

  const { totalCategories, loading: categoriesLoading } = useBookCategories();

  useEffect(() => {
    const fetchPeminjamanData = async () => {
      setPeminjamanLoading(true);
      try {
        // Fetch both total and detailed peminjaman data in parallel
        const [totalResponse, detailResponse] = await Promise.all([
          peminjamanService.getAllPeminjaman(),
          peminjamanService.getAllPeminjaman({
            limit: 1000,
            // status: 'ALL',
            // sort: 'created_at:desc'
          }),
        ]);

        setTotalPeminjaman(totalResponse.totalItems || 0);
        setPeminjamanData(detailResponse.data || []);
      } catch (error) {
        console.error("Error fetching peminjaman data:", error);
        setTotalPeminjaman(0);
        setPeminjamanData([]);
      } finally {
        setPeminjamanLoading(false);
      }
    };

    fetchPeminjamanData();
  }, []);

  const isLoading =
    booksLoading || usersLoading || categoriesLoading || peminjamanLoading;

  return {
    books,
    users,
    totalCategories,
    peminjamanData,
    totalPeminjaman,
    isLoading,

    // metadata
    metadata: {
      booksLoading,
      usersLoading,
      categoriesLoading,
      peminjamanLoading,
    },
  };
};
