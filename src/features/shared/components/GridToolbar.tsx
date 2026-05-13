import { Box, Button, Typography } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import { ReactNode, useCallback, useEffect, useState } from "react";
import useLocalization from "@/hooks/app/useLocalization";
import debounce from 'debounce';

const StyledQuickFilter = styled(GridToolbarQuickFilter)({
    '& .MuiSvgIcon-root': {
        color: "#DDD"
    }
})

interface GridToolbarProps {
    children?: ReactNode,
    searchPlaceHolder: string,
    gotoPage: () => void;
    searchType: 'BE' | 'FE',
    searchText?: string,
    setSearchText?: (value: any) => void,
    searchWidth?: number,
    isPermission?: any
}

function GridToolbar({
    children,
    searchWidth,
    searchPlaceHolder,
    gotoPage,
    searchType,
    searchText = '',
    setSearchText,
    isPermission
}: GridToolbarProps) {
    const { t } = useLocalization();
    const [searchValue, setSearchValue] = useState<string>(searchText);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSearchText?.(searchValue);
    }
    const fetchDataSearch = useCallback(
        debounce(async (value: string | null) => {
            if (setSearchText) {
                setSearchText?.(value);
            }
        }, 1000),
        [setSearchText]
    );

    useEffect(() => {
        fetchDataSearch(searchValue);
    }, [searchValue, fetchDataSearch]);

    return <Box display={'flex'}
        justifyContent={'space-between'}
        alignItems={'right'}
        sx={{ py: 1, mt: 2, mb: 2 }}>
        {/* <Typography variant={'h5'} fontWeight={'700'}>{t.titleAll} {`${rowCount}/${totalItem}`}</Typography> */}


        <Box>
            {!isPermission && (
                <Button
                    variant="outlined"
                    sx={{
                        backgroundColor: (theme) => theme.color.primary.o6,
                        color: '#FFF',
                        '&:hover': {
                            backgroundColor: (theme) => theme.color.primary.o6,
                            color: '#FFF',
                        },
                        height: '42px'
                    }}
                    startIcon={<AddIcon />}
                    onClick={gotoPage}
                >
                    {t?.btnTextCreate}
                </Button>
            )}
        </Box>
        <Box display={'flex'} alignItems={'center'}>

            {searchType === 'BE' ? (
                <form onSubmit={handleSubmit}>
                    <StyledQuickFilter
                        autoFocus
                        sx={{
                            width: searchWidth == null ? '300px' : searchWidth,
                            mr: 2,
                            backgroundColor: 'white',
                            outline: 'none',
                            paddingBottom: 0
                        }}
                        variant='outlined'
                        size='small'
                        value={searchValue}
                        onChange={handleChange}
                        placeholder={searchPlaceHolder}
                    />
                </form>

            ) : (
                <StyledQuickFilter
                    sx={{
                        width: searchWidth == null ? '300px' : searchWidth,
                        mr: 0,
                        backgroundColor: (theme: any) => theme.color.background.o1,
                        paddingBottom: 0,
                        "& .MuiInputBase-input": {
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                        }
                    }}
                    variant='outlined'
                    size='small'
                    placeholder={searchPlaceHolder}
                />
            )}

            {children}

        </Box>

    </Box>
}

export default GridToolbar
