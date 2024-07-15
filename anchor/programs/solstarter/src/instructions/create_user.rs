use anchor_lang::prelude::*;

use crate::state::User;

pub fn create_user(
    ctx: Context<CreateUser>,
    name: String,
    bio: String,
    avatar_url: String,
) -> Result<()> {
    let user = &mut ctx.accounts.user;
    user.wallet_pubkey = ctx.accounts.signer.key();
    user.name = name;
    user.bio = bio;
    user.avatar_url = avatar_url;
    user.created_project_counter = 0;
    Ok(())
}

#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(init, payer = signer, space = 8 + User::INIT_SPACE, seeds = [
        b"user",
        signer.key().as_ref(),
      ],
      bump)]
    pub user: Account<'info, User>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
