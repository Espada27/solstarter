use anchor_lang::prelude::*;

use crate::errors::WithdrawError;
use crate::state::{Project, Status};

pub fn withdraw<'info>(ctx: Context<WithdrawFunds>) -> Result<()> {
    // Project ownership is checked in the project account derivation

    let to_wallet = ctx.accounts.owner_pubkey.to_account_info();
    let goal_amount = ctx.accounts.project.goal_amount;
    let raised_amount = ctx.accounts.project.raised_amount;
    let project_lamports_balance = **ctx.accounts.project.to_account_info().lamports.borrow();

    require_gte!(
        raised_amount,
        goal_amount,
        WithdrawError::UnreachedGoalAmount
    );

    require_eq!(
        raised_amount,
        project_lamports_balance,
        WithdrawError::InvalidAmountToWithdraw
    );

    withdraw_funds(&to_wallet, &ctx.accounts.project.to_account_info())?;

    ctx.accounts.project.status = Status::Completed;

    Ok(())
}

fn withdraw_funds(to_wallet: &AccountInfo, from_project: &AccountInfo) -> Result<()> {
    let amount = **from_project.lamports.borrow();
    **from_project.try_borrow_mut_lamports()? -= amount;
    **to_wallet.try_borrow_mut_lamports()? += amount;
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
