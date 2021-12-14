import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { 
    Grid,
    Flex,
    Box,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';


export interface IShowTests {
    columns: number[],
    list: Record<string, any[]>,
    setList: Dispatch<SetStateAction<Record<number, any[]>>>
}

export function ShowTests ({columns, list, setList}: IShowTests) {

    const getDateString = (filename: string) => {
        const timestamp = filename.substring(filename.indexOf("-")+1, filename.lastIndexOf(".json"));
        const millisecondsTimestamp = parseInt(timestamp);
        const date = new Date(millisecondsTimestamp);
        return date.toString().substr(0, 24);
    }
    
    const dragEnd = (res: Record<string, any>) => {
        const {destination, source, draggableId} = res;
        console.log({ res })

        const newList = columns.map((nb) => {
            if (destination.droppableId == nb) {
                list[nb].splice(destination.index, 0, draggableId)
                return list[nb]
            }
            if (source.droppableId == nb) {
                return list[nb].filter(item => item !== draggableId);
            }
            return list[nb]
        })

        console.log({newList});

        setList({
            ...newList
        })
    }

    console.log({list})

    return (
        <DragDropContext onDragEnd={dragEnd}>
        {columns.map((nb) =>         
            <Flex 
                flexDirection="column"
                key={`${nb}`} 
            >
                <Box
                    p={2}
                    fontSize={12}
                >
                    {nb === 0 ? 'All tests results' : `Version ${nb} (drag tests to compute the results)`}
                </Box>
                <Box
                    border="1px solid var(--chakra-colors-gray-400)"
                    bg={nb === 0 ? 'var(--chakra-colors-gray-100)' : 'white'}
                    height="100%"
                    sx={{
                        '& > div': {
                            height: '100%'
                        }
                    }}
                >
                    <Droppable droppableId={`${nb}`}>
                        {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {list[nb]?.map((file, index) => 
                                    <Draggable draggableId={`${file}`} key={file} index={index}>
                                        {(provided, snapshot) => ( 
                                            <div 
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}>
                                                <Box p={2}  border="1px solid transparent">
                                                    <Box fontSize={12}>{ file }</Box>
                                                    <Box fontSize={10}>{ getDateString(file) }</Box>
                                                </Box>
                                            </div>)}
                                    </Draggable>
                                )}
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
