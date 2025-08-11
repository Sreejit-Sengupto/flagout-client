'use client'
import { SettingsIcon } from 'lucide-react'
import React from 'react'

import type { BundledLanguage } from '@/components/ui/kibo-ui/code-block';
import {
    CodeBlock,
    CodeBlockBody,
    CodeBlockContent,
    CodeBlockCopyButton,
    CodeBlockFilename,
    CodeBlockFiles,
    CodeBlockHeader,
    CodeBlockItem,
    CodeBlockSelect,
    CodeBlockSelectContent,
    CodeBlockSelectItem,
    CodeBlockSelectTrigger,
    CodeBlockSelectValue,
} from '@/components/ui/kibo-ui/code-block';
// import { CodeBlockContent } from '@/components/ui/kibo-ui/code-block/server';

const code = [
    {
        language: 'ts',
        filename: 'flagout.ts',
        code: `import { Flag } from 'flagout';


const flagout = new Flagout('fl_xxxxxxxxx');


(async function() {
  const response = await flag.featureFlags.get({
    name: 'ai_chat_bot',
  });


  if (error) {
    return console.log(error);
  }
  console.log(data);
})();`,
    },
];

const StartShipping = () => {
    return (
        <main className='p-5 min-h-[100dvh] flex flex-col justify-center items-center'>
            <section className='mx-auto w-full flex flex-col justify-center items-center'>
                <p className='scroll-m-20 border-b pb-2 text-2xl lg:text-3xl font-semibold tracking-tight first:mt-0 flex justify-center items-center gap-3'>
                    <span>Effortless</span>
                    <span className='text-pink-700'>Integration</span>
                </p>
                <p className='mt-2 mb-4 max-w-2xl text-center text-gray-400'>A simple, easy to use interface so that you can start adding feature flags to your application right away. It fits right into your code with SDKs for your favorite programming languages.</p>
            </section>
            <section className='mx-auto flex justify-center items-center w-full lg:w-[50%] mt-4'>
                <CodeBlock data={code} defaultValue={code[0].language} className='border-2 border-gray-600'>
                    <CodeBlockHeader className='border-b-2 border-gray-600'>
                        <CodeBlockFiles>
                            {(item) => (
                                <CodeBlockFilename key={item.language} value={item.language}>
                                    {item.filename}
                                </CodeBlockFilename>
                            )}
                        </CodeBlockFiles>
                        <CodeBlockSelect>
                            <CodeBlockSelectTrigger>
                                <CodeBlockSelectValue />
                            </CodeBlockSelectTrigger>
                            <CodeBlockSelectContent>
                                {(item) => (
                                    <CodeBlockSelectItem key={item.language} value={item.language}>
                                        {item.language}
                                    </CodeBlockSelectItem>
                                )}
                            </CodeBlockSelectContent>
                        </CodeBlockSelect>
                        <CodeBlockCopyButton
                            onCopy={() => console.log('Copied code to clipboard')}
                            onError={() => console.error('Failed to copy code to clipboard')}
                        />
                    </CodeBlockHeader>
                    <CodeBlockBody>
                        {(item) => (
                            <CodeBlockItem key={item.language} value={item.language}>
                                <CodeBlockContent language={item.language as BundledLanguage}>
                                    {item.code}
                                </CodeBlockContent>
                            </CodeBlockItem>
                        )}
                    </CodeBlockBody>
                </CodeBlock>
            </section>
        </main>
    )
}

export default StartShipping