import { zodResolver } from "@hookform/resolvers/zod";
import { useRef} from "react";
import { useState } from "react";
import type { SubmitHandler} from "react-hook-form";
import { useForm } from "react-hook-form";
import { IoRocket } from "react-icons/io5";
import TextareaAutoSize from 'react-textarea-autosize';
import type { TaskTextType} from "../states/tasksState";
import { useTasksMutators } from "../states/tasksState";
import { TaskTextSchema } from "../states/tasksState";

const TaskForm = () => {
  const { addTask } = useTasksMutators();
  const [composing, setComposition] = useState(false);
  const [focus, setFocus] = useState(false);


  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleFormSubmit:SubmitHandler<TaskTextType> = (task) => {
    addTask(task);
    reset();
  }

  const { register, handleSubmit,reset } = useForm<TaskTextType>({
    mode:'onSubmit',
    resolver: zodResolver(TaskTextSchema),
  });

  return (
    <form onSubmit={handleSubmit(handleFormSubmit,() => reset())} className=' mx-auto w-full max-w-lg'>
      <div className={`flex relative items-center bg-slate-100 rounded-md border-2 border-slate-200 ${focus ? 'border-purple-600' : ''}`}>
        <TextareaAutoSize
          onCompositionStart={() => setComposition(true)}
          onCompositionEnd={() => setComposition(false)}
          {...register('text')}
          onFocus={() => setFocus(true)}
          onBlur={(e) => {
            register('text').onBlur(e)
            setFocus(false)
          }}
          onKeyDown={(e) => {
            if(e.shiftKey && e.code === 'Enter') {
              if(composing) return;
              e.preventDefault()
              buttonRef?.current?.click();
            }
          }}
          className='overflow-hidden p-3 w-full bg-slate-100 rounded-md focus:outline-none resize-none'
        />
        <button
          ref={buttonRef}
          className='p-2 mx-3 font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-md border transition-colors'
        >
          <IoRocket />
        </button>
      </div>
    </form>
  )
}

export default TaskForm;
