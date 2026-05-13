import {useState, useRef, useEffect, MutableRefObject} from 'react';

interface UseScrollableListProps {
    dataLength: number;
    handleAddItem: () => void;
}

interface UseScrollableListReturn {
    showScrollDown: boolean;
    listRef: MutableRefObject<HTMLDivElement | null>;
    handleAddItemClick: () => void;
    handleScrollToBottom: () => void;
}

const useScrollableList = ({dataLength, handleAddItem}: UseScrollableListProps): UseScrollableListReturn => {
    const [showScrollDown, setShowScrollDown] = useState(false);
    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const listElement = listRef.current;
        if (listElement) {
            if (listElement.scrollHeight > listElement.clientHeight) {
                setShowScrollDown(true);
            } else {
                setShowScrollDown(false);
            }
        }
    }, [dataLength]);

    const handleAddItemClick = () => {
        handleAddItem();
        // setTimeout(() => {
        //     const listElement = listRef.current;
        //     if (listElement) {
        //         listElement.scrollTop = listElement.scrollHeight;
        //     }
        // }, 100);
    };

    const handleScrollToBottom = () => {
        const listElement = listRef.current;
        if (listElement) {
            listElement.scrollTop = listElement.scrollHeight;
            setShowScrollDown(false);
        }
    };

    return {
        showScrollDown,
        listRef,
        handleAddItemClick,
        handleScrollToBottom
    };
};

export default useScrollableList;
