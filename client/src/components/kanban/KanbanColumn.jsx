import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import KanbanCard from './KanbanCard';
import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import { STAGE_COLORS } from '../../utils/constants';

const KanbanColumn = ({ stage, applications = [] }) => {
  const navigate = useNavigate();
  
  const colorClass = {
    Applied: 'bg-blue-500',
    Screening: 'bg-yellow-500',
    Interview: 'bg-purple-500',
    Offer: 'bg-amber-500',
    Hired: 'bg-green-500',
    Rejected: 'bg-red-500',
  }[stage] || 'bg-gray-500';

  return (
    <div className="flex-shrink-0 w-72 lg:w-80 bg-gray-50 dark:bg-slate-800/50 rounded-xl lg:rounded-2xl p-3 lg:p-4 border border-border dark:border-slate-700 flex flex-col h-full shadow-sm">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-2 lg:gap-3">
          <div className={`w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full ${colorClass}`} />
          <h3 className="font-bold text-text-primary dark:text-white uppercase tracking-wider text-[10px] lg:text-xs">
            {stage}
          </h3>
        </div>
        <Badge variant="default" size="sm" className="h-5 lg:h-6 px-1.5 lg:px-2">{applications.length}</Badge>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 flex flex-col gap-4 min-h-[100px] transition-colors rounded-xl p-1 ${
              snapshot.isDraggingOver ? 'bg-primary/5 dark:bg-primary/10 ring-1 ring-primary/20' : ''
            }`}
          >
            {applications.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-10 opacity-40">
                <p className="text-[10px] font-black text-text-secondary dark:text-gray-500 tracking-widest uppercase">NO APPLICANTS</p>
              </div>
            )}
            {applications.map((app, index) => (
              <KanbanCard 
                key={app._id} 
                application={app} 
                index={index} 
                onClick={() => navigate(`/dashboard/company/applicants/${app._id}`)}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
