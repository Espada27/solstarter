use anchor_lang::prelude::*;

use crate::errors::WithdrawError;
use crate::state::{Project, Status};

pub fn withdraw<'info>(ctx: Context<WithdrawFunds>) -> Result<()> {
    /*
     * Project ownership is checked in the project account derivation
     */

    let goal_amount = ctx.accounts.project.goal_amount;
    let raised_amount = ctx.accounts.project.raised_amount;

    require_gte!(
        raised_amount,
        goal_amount,
        WithdrawError::UnreachedGoalAmount
    );

    **ctx
        .accounts
        .project
        .to_account_info()
        .try_borrow_mut_lamports()? -= raised_amount;

    **ctx
        .accounts
        .owner_pubkey
        .to_account_info()
        .try_borrow_mut_lamports()? += raised_amount;

    ctx.accounts.project.status = Status::Completed;

    Ok(())
}

#[derive(Accounts)]
pub struct WithdrawFunds<'info> {
    #[account(mut, has_one = owner_pubkey)]
    pub project: Account<'info, Project>,

    #[account(mut)]
    pub owner_pubkey: Signer<'info>,

    pub system_program: Program<'info, System>,
}
