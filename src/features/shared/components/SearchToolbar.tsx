import { Box, Button, Typography } from "@mui/material";
import { GridToolbarQuickFilter } from "@mui/x-data-grid";
import { styled } from "@mui/system";
import AddIcon from '@mui/icons-material/Add';
import { ReactNode, useState } from "react";
import useLocalization from "@/hooks/app/useLocalization";

const StyledQuickFilter = styled(GridToolbarQuickFilter)({
    '& .MuiSvgIcon-root': {
        color: "#5E697C"
    }
})

interface SearchToolbarProps {
    children?: ReactNode,
    searchPlaceHolder: string,
    gotoPage: () => void;
    searchType: 'BE' | 'FE',
    searchText?: string,
    setSearchText?: (value: any) => void,
    searchWidth?: number,
}

function SearchToolbar({
    children,
    searchWidth,
    searchPlaceHolder,
    gotoPage,
    searchType,
    searchText = '',
    setSearchText
}: SearchToolbarProps) {
    const { t } = useLocalization();
    const [searchValue, setSearchValue] = useState<string>(searchText);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSearchText?.(searchValue);
    }
    return <Box display={'flex'}
        justifyContent={'space-between'}
        alignItems={'right'}
        sx={{ py: 1, mt: 2, mb: 2 }}>
        {/* <Typography variant={'h5'} fontWeight={'700'}>{t.titleAll} {`${rowCount}/${totalItem}`}</Typography> */}


        <Box>
            <Button
                variant="outlined"
                sx={{
                    backgroundColor: (theme) => theme.color.primary.o6,
                    color: '#FFF',
                    '&:hover': {
                        backgroundColor: (theme) => theme.color.primary.o6,
                        color: '#FFF',
                    },
                    height:'42px'
                }}
                startIcon={<AddIcon />}
                onClick={gotoPage}
            >
                
            </Button>
        </Box>
        <Box display={'flex'} alignItems={'center'}>

            {searchType === 'BE' ? (
                <form onSubmit={handleSubmit}>
                    <StyledQuickFilter
                        sx={{
                            width: searchWidth == null ? '300px' : searchWidth,
                            mr:2,
                            backgroundColor: 'white',
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
                        mr:2,
                        backgroundColor: 'white',
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

export default SearchToolbar
