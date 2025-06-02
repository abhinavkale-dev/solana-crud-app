#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("Bfs5UjX5queZULKZbq8PiimwybgtyQ6Zw1TtDLssRWLo");

#[program]
pub mod crud_app {
    use super::*;

    pub fn journal_entry_create(ctx: Context<CreateJournalEntry>, title: String, description: String) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.id = Clock::get()?.unix_timestamp as u64;
        journal_entry.owner = ctx.accounts.owner.key();
        journal_entry.title = title;
        journal_entry.description = description;
        journal_entry.created_at = Clock::get()?.unix_timestamp as u64;
        Ok(())
    }

    pub fn journal_entry_update(ctx: Context<UpdateJournalEntry>, title: String, description: String) -> Result<()> {
        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.title = title;
        journal_entry.description = description;
        Ok(())
    }

    pub fn journal_entry_delete(_ctx: Context<DeleteJournalEntry>, _title: String) -> Result<()> {
        Ok(())
    }
 }

#[derive(Accounts)]
#[instruction(title: String)]
pub struct CreateJournalEntry<'info> {
    #[account(init,
    payer = owner,
    seeds = [title.as_bytes(), owner.key().as_ref()],
    bump,
    space = 8 + JournalEntry::INIT_SPACE,
)]
    pub journal_entry: Account<'info, JournalEntry>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct UpdateJournalEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        realloc = 8 + JournalEntry::INIT_SPACE,
        realloc::payer = owner,
        realloc::zero = true,
    )]
    pub journal_entry: Account<'info, JournalEntry>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteJournalEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        close = owner,
    )]
    pub journal_entry: Account<'info, JournalEntry>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct JournalEntry {
    pub id: u64,
    pub owner: Pubkey,

    #[max_len(32)]
    pub title: String,

    #[max_len(280)]
    pub description: String,

    pub created_at: u64,
}
