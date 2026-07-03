import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import JobCard from './JobCard';

const KanbanBoard = ({ savedJobs, onDragEnd, setSelectedJob, handleDeleteJob, getCurrencySymbol }) => {
  return (
    <main className="kanban-board">
      <DragDropContext onDragEnd={onDragEnd}>
        {['wishlist', 'applied', 'interview'].map((status) => {
          const columnJobs = savedJobs.filter((job) => job.status === status);
          const titles = {
            wishlist: 'Wishlist',
            applied: 'Applied',
            interview: 'Interview'
          };

          return (
            <div key={status} className="kanban-column">
              <h2>{titles[status]} ({columnJobs.length})</h2>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div 
                    className="job-list"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {columnJobs.map((job, index) => (
                      <Draggable key={job._id} draggableId={String(job._id)} index={index}>
                        {(provided) => (
                          <JobCard
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            job={job}
                            mode="kanban"
                            currency={job.currency || getCurrencySymbol('gb')}
                            onClick={() => setSelectedJob(job)}
                            onApply={(j) => window.open(j.redirect_url, '_blank')}
                            onDelete={handleDeleteJob}
                          />
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </main>
  );
};

export default KanbanBoard;
