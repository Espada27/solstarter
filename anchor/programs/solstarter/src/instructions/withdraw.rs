use anchor_lang::prelude::*;

use crate::errors::WithdrawError;
use crate::state::{Contribution, Project, Status};

pub fn withdraw<'info>(ctx: Context<WithdrawFunds>) -> Result<()> {
    // Project ownership is checked in the project account derivation

    let to_wallet = ctx.accounts.owner_pubkey.to_account_info();
    let contributions_count = ctx.accounts.project.contribution_counter as usize;

    // Check if the project is in the Completed status
    validate_project_status(&ctx.accounts.project)?;

    require_eq!(
        contributions_count,
        ctx.remaining_accounts.len(),
        WithdrawError::NotEqualContributionCounter
    );

    for i in 0..contributions_count {
        // Extract Contribution AccountInfo project_pubkey
        let contribution = &ctx.remaining_accounts[i];
        let contribution_ref_data = contribution.try_borrow_data()?;
        let mut contribution_u8_data: &[u8] = &contribution_ref_data;
        let contribution_data: Contribution =
            Contribution::try_deserialize(&mut contribution_u8_data)?;

        //Must be a valid contribution account
        require_neq!(
            contribution_data.project_pubkey,
            ctx.accounts.project.key(),
            WithdrawError::InvalidContributionAccount
        );
        withdraw_funds(&to_wallet, &contribution)?;
    }

    Ok(())
}

fn validate_project_status(project: &Account<Project>) -> Result<()> {
    if project.status != Status::Completed {
        return Err(WithdrawError::InvalidProjectStatus.into());
    }
    Ok(())
}

fn withdraw_funds(to_wallet: &AccountInfo, contribution: &AccountInfo) -> Result<()> {
    let amount = **contribution.lamports.borrow();
    **contribution.try_borrow_mut_lamports()? -= amount;
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
