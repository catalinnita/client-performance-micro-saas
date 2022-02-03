import { 
    Flex,
    IconButton
} from '@chakra-ui/react'
import { 
    AddIcon, 
    MinusIcon 
} from '@chakra-ui/icons';

export interface IAddRemoveColumns {
    columnsNr: number
    setColumns: (columns: number) => void
}

export function AddRemoveColumns ({ columnsNr, setColumns }: IAddRemoveColumns) {
    return (
        <Flex justifyContent="flex-end" p={3} width="100%">
          <IconButton 
            variant='outline'
            size='sm'
            onClick={() => {
              setColumns(columnsNr - 1)
            }}
            aria-label='Remove Columnn' 
            icon={<MinusIcon />} />
          <IconButton 
            variant='outline'
            size='sm'
            onClick={() => {
              setColumns(columnsNr + 1)
            }}
            ml={2} 
            aria-label='Add Column' 
            icon={<AddIcon />} />
        </Flex>
    );
}
