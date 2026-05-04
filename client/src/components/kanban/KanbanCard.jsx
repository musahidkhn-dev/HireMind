import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Calendar, Brain, GripVertical } from 'lucide-react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { timeAgo } from '../../utils/helpers';

const KanbanCard = ({ application, index, onClick }) => {
  const { candidate, job, aiScore, createdAt } = application;
  const scoreValue = aiScore?.fitPercentage;
  const scoreColor = scoreValue >= 80 ? 'success' : scoreValue >= 60 ? 'warning' : 'danger';

  return (
    <Draggable draggableId={application._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick?.(application)}
          style={{
            ...provided.draggableProps.style,
          }}
          className={`group bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-amber-200 dark:hover:border-amber-900 transition-all cursor-grab active:cursor-grabbing select-none ${
            snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-amber-500 scale-105 z-50' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <Avatar name={candidate?.name} src={candidate?.userImage} size="sm" className="rounded-lg" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                  {candidate?.name}
                </h4>
                <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase truncate">
                  {job?.title}
                </p>
              </div>
            </div>
            <GripVertical size={16} className="text-gray-300 group-hover:text-gray-500 shrink-0" />
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
              <Calendar size={12} />
              {timeAgo(createdAt)}
            </div>
            {scoreValue !== undefined && scoreValue !== null && (
              <Badge variant={scoreColor} size="sm" className="flex items-center gap-1 font-black">
                <Brain size={10} /> {scoreValue}%
              </Badge>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
