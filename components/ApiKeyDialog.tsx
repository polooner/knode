import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent, useContext, useEffect, useState } from 'react';
import Spinner from './ui/spinner';
import { useKeyContext } from '@/app-context/key-context-provider';

export default function ApiKeyDialog() {
  const [open, setOpen] = useState<boolean>(false);
  //TODO: dialog not open when no key
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');

  const { apiKey, setApiKey } = useKeyContext();
  console.log('key in dialog is', apiKey);

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else setOpen(true);

    console.log('key in useEffect', apiKey);
  }, [apiKey]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    localStorage.setItem('openai_api_key', input);

    setApiKey(input);
    console.log(localStorage.getItem('openai_api_key'));
    setOpen(() => false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} variant='outline'>
          Edit API Key
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <form>
          <DialogHeader>
            <DialogTitle>Edit API Key</DialogTitle>
            <DialogDescription>
              Make changes to your OPENAI key here.
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='apikey' className='text-right'>
                API Key:
              </Label>
              <Input
                onChange={(e) => setInput(e.target.value)}
                id='apikey'
                value={apiKey as string}
                placeholder='key'
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit' onClick={handleSubmit}>
              Save changes
              {loading ? <Spinner /> : null}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
