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
import { useSearchParams } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import Spinner from './ui/spinner';

export default function ApiKeyDialog() {
  const [apiKey, setApiKey] = useState('');
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const closeDialog = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setApiKey(
        localStorage.getItem('openai_api_key') == null
          ? ''
          : (localStorage.getItem('openai_api_key') as string)
      );
      setOpen(apiKey == '' ? true : false);
    }
  }, [apiKey, open]);

  //TODO: add trycatch blocks
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    closeDialog();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Edit API Key</Button>
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
                id='apikey'
                defaultValue={apiKey}
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
