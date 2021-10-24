import { struct, u8 } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';
import { PublicKey, Signer, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '../constants';
import { TokenInstruction } from './types';
import { addSigners } from './utils';

const dataLayout = struct<{
    instruction: TokenInstruction;
    amount: bigint;
}>([u8('instruction'), u64('amount')]);

/**
 * Construct a Burn instruction
 *
 * @param account      Account to burn tokens from
 * @param mint         Mint for the account
 * @param owner        Owner of the account
 * @param multiSigners Signing accounts if `owner` is a multisig
 * @param amount       Number of tokens to burn
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createBurnInstruction(
    account: PublicKey,
    mint: PublicKey,
    owner: PublicKey,
    multiSigners: Signer[],
    amount: number | bigint,
    programId = TOKEN_PROGRAM_ID
): TransactionInstruction {
    const keys = addSigners(
        [
            { pubkey: account, isSigner: false, isWritable: true },
            { pubkey: mint, isSigner: false, isWritable: true },
        ],
        owner,
        multiSigners
    );

    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
        {
            instruction: TokenInstruction.Burn,
            amount: BigInt(amount),
        },
        data
    );

    return new TransactionInstruction({ keys, programId, data });
}