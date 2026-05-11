import React from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import { PIPELINE_STAGES } from '../../utils/constants';
import { useUpdateStage } from '../../hooks/useApplications';

const KanbanBoard = ({ applications = [] }) => {
  const updateStage = useUpdateStage();

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const application = applications.find(app => app._id === draggableId);
    if (!application) return;

    // Call mutation with new stage
    updateStage.mutate({
      id: draggableId,
      data: { stage: destination.droppableId }
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6 overflow-x-auto pb-8 min-h-[70vh] px-2 -mx-2 scrollbar-hide">
        {PIPELINE_STAGES.map((stage) => {
          const stageApps = applications.filter(app => app.currentStage === stage);
          return (
            <KanbanColumn
              key={stage}
              stage={stage}
              applications={stageApps}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
