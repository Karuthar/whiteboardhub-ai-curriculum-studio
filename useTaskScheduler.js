import { useState } from "react";

export default function useTaskScheduler() {

    const [queue, setQueue] = useState([]);

    function schedule(task, runner) {

        const id = Date.now();

        setQueue(prev => [

            ...prev,

            {

                id,

                task,

                status: "Queued"

            }

        ]);

        setTimeout(async () => {

            setQueue(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, status: "Running" }
                        : item
                )
            );

            try {

                await runner();

                setQueue(prev =>
                    prev.map(item =>
                        item.id === id
                            ? { ...item, status: "Completed" }
                            : item
                    )
                );

            }

            catch {

                setQueue(prev =>
                    prev.map(item =>
                        item.id === id
                            ? { ...item, status: "Failed" }
                            : item
                    )
                );

            }

        }, 100);

    }

    return {

        queue,

        schedule

    };

}