'use client';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Task } from './data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, SquarePen, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import DeleteConfirmationDialog from '@/components/delete-confirmation-dialog';
import { useState } from 'react';
import EditTask from './edit-task';
import { Icon } from '@/components/ui/icon';
import { TaskDTO } from '@/dtos/AplicationDTO';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

function TaskCard({ task }: { task: TaskDTO }) {
  const [open, setOpen] = useState<boolean>(false);
  const [editTaskOpen, setEditTaskOpen] = useState<boolean>(false);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: true,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <DeleteConfirmationDialog open={open} onClose={() => setOpen(false)} />
      <EditTask open={editTaskOpen} setOpen={setEditTaskOpen} />
      <Card
        className={cn('', {
          'opacity-10 bg-primary/50 ': isDragging,
        })}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <CardHeader className='flex-row gap-1 p-2.5 items-center space-y-0'>
          {/* <Avatar className="flex-none h-8 w-8 rounded bg-default-200 text-default hover:bg-default-200">
                        <AvatarImage src={projectLogo} />
                        <AvatarFallback className="uppercase">  {title.charAt(0) + title.charAt(1)}</AvatarFallback>
                    </Avatar> */}
          <h3 className='flex-1 text-default-800 text-lg font-medium truncate text-center capitalize '>
            {task.taskName}
            <br />
            <span className=' bg-destructive/10 text-destructive rounded-full px-2 py-0.5 ml-2 text-sm '>
              Mức độ ưu tiên {task.priorityNum}
            </span>
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size='icon'
                className='flex-none ring-offset-transparent bg-transparent hover:bg-transparent hover:ring-0 hover:ring-transparent w-6'
              >
                <MoreVertical className='h-4 w-4 text-default-900' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='p-0 overflow-hidden' align='end'>
              <DropdownMenuItem
                className='py-2 border-b border-default-200 text-default-600 focus:bg-default focus:text-default-foreground rounded-none cursor-pointer'
                onClick={() => setEditTaskOpen(true)}
              >
                <SquarePen className='w-3.5 h-3.5 me-1' />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className='py-2 bg-destructive/30 text-destructive focus:bg-destructive focus:text-destructive-foreground rounded-none cursor-pointer'
                onClick={() => setOpen(true)}
              >
                <Trash2 className='w-3.5 h-3.5  me-1' />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className='p-2.5 pt-1'>
          <div className='text-default-600 h-16'>{task.description}</div>
          <div className='flex gap-4 mt-6'>
            <div>
              <div className=' text-default-400 mb-1'>Chuồng</div>
              <div className=' text-default-600  font-medium'>
                {task.cageName}
              </div>
            </div>
            <Separator
              orientation='vertical'
              className='text-default-200 h-12'
            />
            <div>
              <div className=' text-default-400 mb-1'>Loại công việc</div>
              <div className=' text-default-600  font-medium'>
                {task.taskType.taskTypeName}
              </div>
            </div>
          </div>
          <Separator className='text-default-200 my-2' />
          <div className='flex gap-2 mt-2'>
            <div>
              <div className=' text-default-400 mb-1'>Bắt đầu</div>
              <div className=' text-default-600  font-medium'>
                {format(new Date(task.createdAt), 'dd/MM/yyyy')}
              </div>
            </div>
            <Separator
              orientation='vertical'
              className='text-default-200 h-12'
            />
            <div>
              <div className=' text-default-400 mb-1'>Kết thúc</div>
              <div className=' text-default-600  font-medium'>
                {format(new Date(task.dueDate), 'dd/MM/yyyy')}
              </div>
            </div>
            <Separator
              orientation='vertical'
              className='text-default-200 h-12'
            />
            <div>
              <div className=' text-default-400 mb-1'>Buổi</div>
              <div className=' text-default-600 bg-lime-100  rounded-sm px-2 py-0.5  font-medium'>
                {' '}
                {task.session === 1
                  ? 'Sáng'
                  : task.session === 2
                  ? 'Trưa'
                  : task.session === 3
                  ? 'Chiều'
                  : 'Tối'}
              </div>
            </div>
          </div>

          <div className='mt-1'>
            <div className='text-end text-xs text-default-600 mb-1.5 font-medium'>
              {/* {progress}% */}
            </div>
            {/* <Progress value={progress} color='primary' size='sm' /> */}
          </div>
          <div className='flex mt-5'>
            <div className='flex-1'>
              <div className='text-default-400  text-sm font-normal mb-3'>
                Phân công cho nhân viên
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='flex items-center '>
                      <Avatar
                        className='h-6 w-6'
                        variant='outline'
                        shape='square'
                      >
                        <AvatarImage src={undefined} />
                        <AvatarFallback>
                          {task.assignedToUser.fullName.charAt(0) +
                            task.assignedToUser.fullName.charAt(1)}
                        </AvatarFallback>
                      </Avatar>
                      <span className='ml-2'>
                        {' '}
                        {task.assignedToUser.fullName}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {task.assignedToUser.fullName} -{' '}
                      {task.assignedToUser.email} -{' '}
                      {task.assignedToUser.phoneNumber}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default TaskCard;
