import {useRouter} from "next/router";
import useSWR from "swr";

const fetcher = (url: string) =>
    fetch(url)
        .then((res) => res.json())
        .then((json) => json.data);

const EditHabit = () => {
    const router = useRouter();
    const {id} = router.query;
    const {
        data: habit,
        error,
        isLoading,
    } = useSWR(id ? `/api/habits/${id}` : null, fetcher);

    if (error) return <p>Failed to load</p>;
    if (isLoading) return <p>Loading...</p>;
    if (!habit) return null;

    return (
        <p>Implement later</p>
    );
};

export default EditHabit;
