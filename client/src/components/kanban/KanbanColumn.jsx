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
    <div className="flex-shrink-0 w-80 bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-4 border border-gray-100 dark:border-gray-800 flex flex-col h-full">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
          <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">
            {stage}
          </h3>
        </div>
        <Badge variant="default" size="sm">{applications.length}</Badge>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 flex flex-col gap-4 min-h-[100px] transition-colors rounded-xl p-1 ${
              snapshot.isDraggingOver ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''
            }`}
          >
            {applications.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-10 opacity-40">
                <p className="text-xs font-bold text-gray-400">NO APPLICANTS</p>
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
