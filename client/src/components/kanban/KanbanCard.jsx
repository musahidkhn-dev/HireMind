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
          className={`group bg-white dark:bg-slate-800 p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-sm border border-border dark:border-slate-700 hover:shadow-md hover:border-primary/30 dark:hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing select-none ${
            snapshot.isDragging ? 'rotate-2 shadow-xl ring-2 ring-primary scale-105 z-50' : ''
          }`}
        >
          <div className="flex items-start justify-between gap-2 lg:gap-3">
            <div className="flex items-center gap-2 lg:gap-3">
              <Avatar name={candidate?.name} src={candidate?.userImage} size="xs" className="rounded-lg lg:hidden" />
              <Avatar name={candidate?.name} src={candidate?.userImage} size="sm" className="rounded-lg hidden lg:block" />
              <div>
                <h4 className="text-xs lg:text-sm font-bold text-text-primary dark:text-white line-clamp-1">
                  {candidate?.name}
                </h4>
                <p className="text-[9px] lg:text-[10px] font-semibold text-text-secondary dark:text-gray-400 uppercase truncate">
                  {job?.title}
                </p>
              </div>
            </div>
            <GripVertical size={14} className="lg:w-4 lg:h-4 text-border dark:text-slate-600 group-hover:text-text-secondary shrink-0" />
          </div>

          <div className="mt-3 lg:mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1 lg:gap-1.5 text-[9px] lg:text-[10px] font-bold text-text-secondary dark:text-gray-500 uppercase">
              <Calendar size={10} className="lg:w-3 lg:h-3" />
              {timeAgo(createdAt)}
            </div>
            {scoreValue !== undefined && scoreValue !== null && (
              <Badge variant={scoreColor} size="sm" className="flex items-center gap-1 font-black text-[9px] lg:text-[10px] h-5 lg:h-6 px-1.5 lg:px-2">
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
