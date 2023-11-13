import React, { Dispatch, SetStateAction } from 'react';
import { 
    Flex,
    Box,
    Text, 
} from '@chakra-ui/react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

export interface IShowTests {
    columnsNr: number,
    list: Record<string, any[]>,
    setList: Dispatch<SetStateAction<Record<number, any[]>>>
}

export function ShowTests ({columnsNr, list, setList}: IShowTests) {

    const getDateString = (filename: string) => {
        const timestamp = filename.substring(filename.lastIndexOf("-")+1, filename.lastIndexOf(".json"));
        const millisecondsTimestamp = parseInt(timestamp);
        const date = new Date(millisecondsTimestamp);
        return date.toString().substr(0, 24);
    }

    const getNiceFilename = (filename: string) => {
        const startIndex = filename.lastIndexOf("-")
        const endIndex = filename.lastIndexOf("~")

        return filename.replace(filename.substring(startIndex, endIndex), "").replace(".json", "")
    }
    
    const dragEnd = (res: Record<string, any>) => {
        const {destination, source, draggableId} = res;
        console.log({columnsNr})
        const newList = Array.from(Array(columnsNr).keys()).map((column) => {
            // reorder items in the list
            if (destination.droppableId == column && source.droppableId == column) {
                console.log({column, list})
                const el = list[column].splice(source.index, 1)[0]
                list[column].splice(destination.index, 0, el)
                return list[column]
            }
            // place new item in the list
            if (destination.droppableId == column) {
                console.log({column, list, destination, draggableId})
                if (typeof(list[column]) === 'undefined') {
                    list[column] = []
                } 
                list[column].splice(destination.index, 0, draggableId)
                return list[column]
            }
            // remove item from the list
            if (source.droppableId == column) {
                return list[column].filter(item => item !== draggableId)
            }
            return list[column]
        })

        setList({
            ...newList
        })
    }

    return (
        <DragDropContext onDragEnd={dragEnd}>
        {Array.from(Array(columnsNr).keys()).map((nb) =>         
            <Flex 
                flexDirection="column"
                key={`${nb}`} 
            >
                <Box
                    borderRadius={12}
                    border="1px solid var(--chakra-colors-gray-300)"
                    bg="white"
                    height="100%"
                    maxHeight="500px"
                    overflow="auto"
                    sx={{
                        '& > div': {
                            height: '100%'
                        }
                    }}
                >
                    <Droppable droppableId={`${nb}`}>
                        {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {list[nb]?.length > 0 ? list[nb]?.map((file, index) => 
                                    <Draggable draggableId={`${file}`} key={file} index={index}>
                                        {(provided, snapshot) => ( 
                                            <div 
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}>
                                                <Box px={4} py={3}  border="1px solid transparent">
                                                    <Box fontSize={13} fontWeight="600">{ getNiceFilename(file) }</Box>
                                                    <Box fontSize={10}>{ getDateString(file) }</Box>
                                                </Box>
                                            </div>)}
                                    </Draggable>
                                ):
                                <Flex 
                                    alignItems="center"
                                    justifyContent="center"
                                    width="100%"
                                    height="100%"
                                    
                                >
                                    <Text textAlign="center" maxWidth="180px" fontSize="13px" color="var(--chakra-colors-gray-400)">
                                        Drop test files to generate results comparison
                                    </Text>
                                </Flex>
                                }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>   
                </Box>
            </Flex>
        )}
        </DragDropContext> 
    );
}
