use anchor_lang::prelude::*;

use crate::errors::ProjectError;
use crate::state::{Contribution, Project, Status, User};

pub fn add_contribution(ctx: Context<AddContribution>, amount: u32) -> Result<()> {
    let contribution = &mut ctx.accounts.contribution;
    let project = &mut ctx.accounts.project;
    let user = &mut ctx.accounts.user;

    if project.status != Status::Ongoing {
        return Err(ProjectError::ProjectNotOngoing.into());
    }
    // Check if the contribution PDA is already initialized
    if contribution.user_pubkey == Pubkey::default() {
        contribution.user_pubkey = *user.to_account_info().key;
        contribution.project_pubkey = *project.to_account_info().key;
        contribution.amount = amount;
        project.contribution_counter += 1;
    } else {
        contribution.amount += amount;
    }
    project.raised_amount += amount;

    Ok(())
}

#[derive(Accounts)]
#[instruction(amount: u32)]
pub struct AddContribution<'info> {
    #[account(mut)]
    pub user: Account<'info, User>,

    #[account(mut)]
    pub project: Account<'info, Project>,

    #[account(
        init_if_needed,
        payer = signer,
        space = 8 + Contribution::INIT_SPACE,
        seeds = [b"contribution", project.key().as_ref()],
        bump
    )]
    pub contribution: Account<'info, Contribution>,

    #[account(mut)]
    pub signer: Signer<'info>,

    pub system_program: Program<'info, System>,
}
